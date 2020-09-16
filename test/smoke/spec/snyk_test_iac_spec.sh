#shellcheck shell=sh

Describe "Snyk iac test command"
  Before snyk_login
  After snyk_logout

  Describe "iac test"
    It "finds issues in single kubernetes file"
      When run snyk iac test ../fixtures/iac-kubernetes/multi-file.yaml
      The status should be failure # issues found
      The output should include "Testing ../fixtures/iac-kubernetes/multi-file.yaml..."
      # Outputs issues   
      The output should include "Infrastructure as code issues:"
      The output should include "✗ Container is running in privileged mode [High Severity] [SNYK-CC-K8S-1] in Deployment"
      The output should include "introduced by input > spec > template > spec > containers[snyky1] > securityContext > privileged"
      
      # Outputs Summary
      The output should include "Organization:"
      The output should include "Type:              Kubernetes"
      The output should include "Target file:       ../fixtures/iac-kubernetes/multi-file.yaml"
      The output should include "Project name:      iac-kubernetes"
      The output should include "Open source:       no"
      The output should include "Project path:      ../fixtures/iac-kubernetes/multi-file.yaml"
      The output should include "Tested ../fixtures/iac-kubernetes/multi-file.yaml for known issues, found 11 issues"
      The stderr should equal ""
    End

    It "finds issues in terraform file"
      When run snyk iac test ../fixtures/iac-terraform/sg_open_ssh.tf
      The status should be failure # issues found
      The output should include "Testing ../fixtures/iac-terraform/sg_open_ssh.tf..."
      # Outputs issues   
      The output should include "Infrastructure as code issues:"
      The output should include "✗ Security Group allows open ingress [Medium Severity] [SNYK-CC-TF-1] in Security Group"
      The output should include "introduced by resource > aws_security_group[allow_ssh] > ingress"
      
      # Outputs Summary
      The output should include "Organization:"
      The output should include "Type:              Terraform"
      The output should include "Target file:       ../fixtures/iac-terraform/sg_open_ssh.tf"
      The output should include "Project name:      iac-terraform"
      The output should include "Open source:       no"
      The output should include "Project path:      ../fixtures/iac-terraform/sg_open_ssh.tf"
      The output should include "Tested ../fixtures/iac-terraform/sg_open_ssh.tf for known issues, found 1 issues"
    End
  End
End
